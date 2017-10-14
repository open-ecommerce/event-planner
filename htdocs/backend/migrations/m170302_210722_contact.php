<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210722_contact extends Migration
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
            '{{%contact}}',
            [
                'id'=> $this->primaryKey(11),
                'contact_type_id'=> $this->integer(11)->notNull()->defaultValue(0),
                'name'=> $this->string(200)->notNull()->defaultValue('0'),
                'website'=> $this->string(200)->notNull()->defaultValue('0'),
                'phone'=> $this->string(50)->notNull()->defaultValue('0'),
                'email'=> $this->string(50)->notNull()->defaultValue('0'),
                'notes'=> $this->text()->null()->defaultValue(null),
            ],$tableOptions
        );
        $this->createIndex('fk_contact_type','{{%contact}}','contact_type_id',false);
    }

    public function safeDown()
    {
        $this->dropIndex('fk_contact_type', '{{%contact}}');
        $this->dropTable('{{%contact}}');
    }
}
