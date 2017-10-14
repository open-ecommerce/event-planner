<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205353_key_storage_item extends Migration
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
            '{{%key_storage_item}}',
            [
                'key'=> $this->string(128)->notNull(),
                'value'=> $this->text()->notNull(),
                'comment'=> $this->text()->null()->defaultValue(null),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
        $this->createIndex('idx_key_storage_item_key','{{%key_storage_item}}','key',true);
    }

    public function safeDown()
    {
        $this->dropIndex('idx_key_storage_item_key', '{{%key_storage_item}}');
        $this->dropTable('{{%key_storage_item}}');
    }
}
