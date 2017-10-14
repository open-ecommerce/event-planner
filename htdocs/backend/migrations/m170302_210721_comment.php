<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210721_comment extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%comment}}',
            [
                'id'=> $this->primaryKey(11),
                'entity'=> $this->char(10)->notNull(),
                'entityId'=> $this->integer(11)->notNull(),
                'content'=> $this->text()->notNull(),
                'parentId'=> $this->integer(11)->null()->defaultValue(null),
                'level'=> $this->smallInteger(6)->notNull()->defaultValue(1),
                'createdBy'=> $this->integer(11)->notNull(),
                'updatedBy'=> $this->integer(11)->notNull(),
                'relatedTo'=> $this->string(500)->notNull(),
                'url'=> $this->text()->null()->defaultValue(null),
                'status'=> $this->smallInteger(6)->notNull()->defaultValue(1),
                'createdAt'=> $this->integer(11)->notNull(),
                'updatedAt'=> $this->integer(11)->notNull(),
            ],$tableOptions
        );
        $this->createIndex('idx-Comment-entity','{{%comment}}','entity',false);
        $this->createIndex('idx-Comment-status','{{%comment}}','status',false);
    }

    public function safeDown()
    {
        $this->dropIndex('idx-Comment-entity', '{{%comment}}');
        $this->dropIndex('idx-Comment-status', '{{%comment}}');
        $this->dropTable('{{%comment}}');
    }
}
