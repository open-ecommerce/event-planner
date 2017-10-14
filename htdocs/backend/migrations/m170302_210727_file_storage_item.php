<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210727_file_storage_item extends Migration
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
            '{{%file_storage_item}}',
            [
                'id'=> $this->primaryKey(11),
                'component'=> $this->string(255)->notNull(),
                'base_url'=> $this->string(1024)->notNull(),
                'path'=> $this->string(1024)->notNull(),
                'type'=> $this->string(255)->null()->defaultValue(null),
                'size'=> $this->integer(11)->null()->defaultValue(null),
                'name'=> $this->string(255)->null()->defaultValue(null),
                'upload_ip'=> $this->string(15)->null()->defaultValue(null),
                'created_at'=> $this->integer(11)->notNull(),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%file_storage_item}}');
    }
}
